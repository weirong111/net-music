export interface LyricItem {
  time: number;
  text: string;
}

export const formatLyric = (str: string): LyricItem[] => {
  const lines = str.split("\n");
  const lyric: LyricItem[] = [];

  const timeReg = /\[(\d{2}):(\d{2}\.\d{3})\]/;
  for (const line of lines) {
    const matches = line.match(timeReg);
    if (!matches) continue;

    const time = parseInt(matches[1]) * 60 * 1000 + parseFloat(matches[2]) * 1000;
    const text = line.substring(line.lastIndexOf("]") + 1).trim();
    if (text) {
      lyric.push({ time, text });
    }
  }

  return lyric;
};
