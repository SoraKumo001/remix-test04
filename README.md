# Sample of Server Side Rendering (SSR) with fetch in a component

- [Demo](https://remix-test04.pages.dev/)

# Sample code

- \_index.tsx

```tsx
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
```

- weatehr.$code.tsx

```tsx
import { useParams } from "@remix-run/react";
import { useSSR } from "next-ssr";

export interface WeatherType {
  publishingOffice: string;
  reportDatetime: string;
  targetArea: string;
  headlineText: string;
  text: string;
}

/**
 * Components for displaying weather information
 */
const Weather = ({ code }: { code: number }) => {
  const { data, reload, isLoading } = useSSR<WeatherType>(
    () =>
      fetch(
        `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${code}.json`
      )
        .then((r) => r.json())
        .then(
          // Additional weights (100 ms)
          (r) =>
            new Promise((resolve) =>
              setTimeout(() => resolve(r as WeatherType), 100)
            )
        ),
    { key: code }
  );
  if (!data) return <div>loading</div>;
  const { targetArea, reportDatetime, headlineText, text } = data;
  return (
    <div
      style={
        isLoading ? { background: "gray", position: "relative" } : undefined
      }
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            color: "white",
            top: "50%",
            left: "50%",
          }}
        >
          loading
        </div>
      )}
      <h1>{targetArea}</h1>
      <button onClick={reload}>Reload</button>
      <div>
        {new Date(reportDatetime).toLocaleString("ja-JP", {
          timeZone: "JST",
        })}
      </div>
      <div>{headlineText}</div>
      <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
    </div>
  );
};

/**
 * Page display components
 */

const Page = () => {
  const params = useParams();
  const code = params.code;
  return (
    <>
      <Weather code={Number(code)} />
    </>
  );
};
export default Page;
```
