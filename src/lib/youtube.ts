import { unstable_cache } from "next/cache";
import type { Reel } from "@/app/learn/data";

/**
 * Pulls Learn reels from YouTube playlists (or channels).
 *
 * Env:
 *   YOUTUBE_PLAYLISTS  - one or more playlist or channel links, separated by
 *                        commas or new lines. Each playlist's title becomes the
 *                        reels' category; prefix "Label=" to override it, e.g.
 *                        "Skincare Basics=https://www.youtube.com/playlist?list=PL..."
 *   YOUTUBE_API_KEY    - optional YouTube Data API v3 key. Without it, YouTube's
 *                        public feeds are used, which list the 15 newest videos
 *                        of each playlist; with it, up to 50.
 *
 * Results are cached for an hour, so new playlist videos appear without a deploy.
 */

const API = "https://www.googleapis.com/youtube/v3";
const FEEDS = "https://www.youtube.com/feeds/videos.xml";
const REVALIDATE_SECONDS = 3600;
const MAX_PER_PLAYLIST = 50;

interface Source {
  label?: string;
  playlistId?: string;
  channelId?: string;
  handle?: string;
}

/** A playlist video, from either the API or the public feed. */
interface Video {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface PlaylistItem {
  snippet: {
    title: string;
    description: string;
    thumbnails?: Record<string, { url: string; width?: number; height?: number }>;
  };
  contentDetails: { videoId: string };
}

function parseSource(entry: string): Source | null {
  const [maybeLabel, ...rest] = entry.split("=");
  // "Label=https://..." but not a bare URL that contains "=" (like ?list=).
  const hasLabel = rest.length > 0 && !/^https?:|^www\.|youtube|youtu\.be/i.test(maybeLabel);
  const label = hasLabel ? maybeLabel.trim() : undefined;
  const raw = (hasLabel ? rest.join("=") : entry).trim();
  if (!raw) return null;

  if (/^(PL|UU|FL|OL|LL)[\w-]{10,}$/.test(raw)) return { label, playlistId: raw };
  if (/^UC[\w-]{22}$/.test(raw)) return { label, channelId: raw };
  if (raw.startsWith("@")) return { label, handle: raw };

  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const list = url.searchParams.get("list");
  if (list) return { label, playlistId: list };
  const channel = url.pathname.match(/\/channel\/(UC[\w-]{22})/);
  if (channel) return { label, channelId: channel[1] };
  const handle = url.pathname.match(/\/(@[\w.-]+)/);
  if (handle) return { label, handle: handle[1] };
  return null;
}

async function api<T>(path: string, params: Record<string, string>, key: string): Promise<T> {
  const res = await fetch(`${API}/${path}?${new URLSearchParams({ ...params, key })}`);
  if (!res.ok) throw new Error(`YouTube API ${path} ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Resolves a source to a playlist id and a display title. */
async function resolvePlaylist(source: Source, key: string) {
  if (source.playlistId) {
    const data = await api<{ items: { snippet: { title: string } }[] }>(
      "playlists",
      { part: "snippet", id: source.playlistId },
      key,
    );
    return {
      playlistId: source.playlistId,
      title: data.items[0]?.snippet.title,
    };
  }

  const data = await api<{
    items?: {
      snippet: { title: string };
      contentDetails: { relatedPlaylists: { uploads: string } };
    }[];
  }>(
    "channels",
    {
      part: "snippet,contentDetails",
      ...(source.channelId ? { id: source.channelId } : { forHandle: source.handle! }),
    },
    key,
  );
  const channel = data.items?.[0];
  if (!channel) throw new Error(`YouTube channel not found: ${source.channelId ?? source.handle}`);
  return {
    playlistId: channel.contentDetails.relatedPlaylists.uploads,
    title: channel.snippet.title,
  };
}

/** youtube.com/shorts/<id> answers 200 for Shorts and redirects for regular videos. */
async function isShort(id: string) {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: "HEAD",
      redirect: "manual",
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

/** Store product links in a description, e.g. bramacosmetics.com/products/<id>. */
function linkedProductIds(description: string) {
  return Array.from(description.matchAll(/\/products\/([a-z0-9]{20,32})/gi), (m) => m[1]);
}

/** Description lines that are links, credits or plugs rather than a summary. */
const BOILERPLATE =
  /^[#@]|inquir|enquir|\S+@\S+\.\w+|subscribe|affiliate|sponsor|discount|promo code|use code|business|contact|follow (me|us)|instagram|tiktok|snapchat|twitter|facebook|pinterest|threads|music by|disclaimer|shop (everything|my|the)|products? mentioned|p r o d u c t/i;

/** The first descriptive line of a video's description, without links or plugs. */
function summarize(description: string) {
  const line =
    description
      .split("\n")
      .map((l) =>
        l
          .replace(/https?:\/\/\S+/g, "")
          .replace(/\s+/g, " ")
          .trim(),
      )
      // A sentence, not a "Label: value" credit line or a link list heading.
      .find(
        (l) =>
          l.split(" ").length >= 5 &&
          !l.endsWith(":") &&
          !/^[^:]{1,40}:\s*\S*$/.test(l) &&
          !BOILERPLATE.test(l),
      ) ?? "";
  return line.length > 160 ? `${line.slice(0, 157).trimEnd()}...` : line;
}

async function apiPlaylist(source: Source, key: string) {
  const { playlistId, title } = await resolvePlaylist(source, key);
  const data = await api<{ items: PlaylistItem[] }>(
    "playlistItems",
    {
      part: "snippet,contentDetails",
      playlistId,
      maxResults: String(MAX_PER_PLAYLIST),
    },
    key,
  );

  // Private and deleted videos stay in playlists but have no thumbnails.
  const videos: Video[] = data.items
    .filter((item) => item.snippet.thumbnails?.default)
    .map((item) => {
      const thumbs = item.snippet.thumbnails!;
      return {
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        image: (thumbs.maxres ?? thumbs.standard ?? thumbs.high ?? thumbs.default).url,
      };
    });
  return { title, videos };
}

function decodeXml(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function xmlTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? decodeXml(match[1].trim()) : "";
}

/** A channel handle's id, read from its page (the public feeds need the id). */
async function channelIdForHandle(handle: string) {
  const res = await fetch(`https://www.youtube.com/${handle}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const id = (await res.text()).match(
    /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/,
  )?.[1];
  if (!id) throw new Error(`YouTube channel not found: ${handle}`);
  return id;
}

/** Keyless: YouTube's public Atom feed, which lists a playlist's 15 newest videos. */
async function feedPlaylist(source: Source) {
  const param: Record<string, string> = source.playlistId
    ? { playlist_id: source.playlistId }
    : { channel_id: source.channelId ?? (await channelIdForHandle(source.handle!)) };
  const res = await fetch(`${FEEDS}?${new URLSearchParams(param)}`);
  if (!res.ok) throw new Error(`YouTube feed ${JSON.stringify(param)} ${res.status}`);
  const xml = await res.text();

  const [head, ...entries] = xml.split("<entry>");
  const videos: Video[] = entries.map((entry) => ({
    id: xmlTag(entry, "yt:videoId"),
    title: xmlTag(entry, "title"),
    description: xmlTag(entry, "media:description"),
    image: decodeXml(entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] ?? ""),
  }));
  return {
    title: xmlTag(head, "title").replace(/^Uploads from /, ""),
    videos: videos.filter((v) => v.id),
  };
}

async function fetchPlaylistReels(source: Source, key?: string): Promise<Reel[]> {
  const { title, videos } = key ? await apiPlaylist(source, key) : await feedPlaylist(source);
  const shorts = await Promise.all(videos.map((v) => isShort(v.id)));

  return videos.map((v, i) => ({
    slug: v.id,
    title: v.title,
    category: source.label || title || "Videos",
    summary: summarize(v.description),
    video: `https://www.youtube.com/embed/${v.id}`,
    image: v.image || undefined,
    vertical: shorts[i],
    productIds: linkedProductIds(v.description),
  }));
}

const getCachedReels = unstable_cache(
  async (sources: string, key?: string): Promise<Reel[]> => {
    const entries = sources
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const results = await Promise.allSettled(
      entries.map((entry) => {
        const source = parseSource(entry);
        if (!source) return Promise.reject(new Error(`Unrecognised YouTube link: ${entry}`));
        return fetchPlaylistReels(source, key);
      }),
    );

    const seen = new Set<string>();
    const reels: Reel[] = [];
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("[youtube]", result.reason);
        continue;
      }
      for (const reel of result.value) {
        if (seen.has(reel.slug)) continue;
        seen.add(reel.slug);
        reels.push(reel);
      }
    }
    return reels;
  },
  ["learn-youtube-reels"],
  { revalidate: REVALIDATE_SECONDS },
);

/** Reels from the configured playlists, or [] when none are set or YouTube fails. */
export async function getYouTubeReels(): Promise<Reel[]> {
  const key = process.env.YOUTUBE_API_KEY || undefined;
  const sources = process.env.YOUTUBE_PLAYLISTS;
  if (!sources) return [];
  try {
    return await getCachedReels(sources, key);
  } catch (err) {
    console.error("[youtube]", err);
    return [];
  }
}
