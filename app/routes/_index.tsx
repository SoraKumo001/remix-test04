import { Link } from "@remix-run/react";
import { useSSR } from "next-ssr";

interface Center {
  name: string;
  enName: string;
  officeName?: string;
  children?: string[];
  parent?: string;
  kana?: string;
}
interface Centers {
  [key: string]: Center;
}
interface Area {
  centers: Centers;
  offices: Centers;
  class10s: Centers;
  class15s: Centers;
  class20s: Centers;
}

/**
 * Page display components
 */
const Page = () => {
  const { data, reload } = useSSR<Area | null | undefined>(
    async () =>
      fetch(`https://www.jma.go.jp/bosai/common/const/area.json`).then((r) =>
        r.json()
      ),
    { key: "area" }
  );

  return (
    <div>
      <div>
        <a href="https://github.com/SoraKumo001/remix-test04">Source code</a>
      </div>
      <button onClick={() => reload()}>Reload</button>
      {data &&
        Object.entries(data.offices).map(([code, { name }]) => (
          <div key={code}>
            <Link to={`/weather/${code}`}>{name}</Link>
          </div>
        ))}
    </div>
  );
};
export default Page;
