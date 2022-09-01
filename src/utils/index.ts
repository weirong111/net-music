export const formatLyric = (str: string) => {
  const arr = str.split("\n");

  const help = [];
  for (let item of arr) {
    const itemArray = [];
    const reg = /\[(.+?)\]/g;
    const hel = item.match(reg);

    if (!hel) continue;
    else {
      const time = item.slice(1, 9).split(":");
      const formatTime =
        parseInt(time[0]) * 60 * 1000 + parseFloat(time[1]) * 1000;
      itemArray.push(formatTime);
    }
    const index = item.lastIndexOf("]");
    if (index === -1) continue;
    else {
      const st = item.substring(index + 1);
      if (!!!st) continue;
      itemArray.push(st);
    }
    help.push(itemArray);
  }
  return help;
};
