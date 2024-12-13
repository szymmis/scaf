import osOpen from "open";
import { Api } from "../../lib/api";

export default async function open(t: { day: number; year: number }) {
  await osOpen(Api.getTaskURL(t.year, t.day));
}
