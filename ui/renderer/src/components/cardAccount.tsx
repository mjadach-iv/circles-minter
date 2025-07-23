import { useEffect } from "react";
import { Card, CardBody } from "@heroui/react";
import { useStore } from "../store";
import type { Address } from "../types";

type Props = {
  address: Address;
  name: string;
  description?: string;
  image?: string;
};

export default function AccountCard({ address, name, description, image }: Props) {
  const getTotalBalance = useStore((state) => state.getTotalBalance);
  const balances = useStore((state) => state.balances);
  const balanceFetch = balances[address]?.isFetching
  const totalBalance = balances[address]?.balance;
  const mintable = balances[address]?.mintable || 0;

  useEffect(() => {
    getTotalBalance(address);
    const interval = setInterval(() => {
      getTotalBalance(address);
    }, 60 * 60 * 1000); // every hour
    return () => clearInterval(interval);
  }, [address, getTotalBalance]);

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[350px]"
      shadow="sm"
    >
      <CardBody>
        <div className="flex gap-4">
          <img
            alt="Album cover"
            className="object-cover shrink-0"
            src={image ||
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjA1ODYgMjkuNDgxNkMxNi4wNTg2IDMwLjIzNDcgMTUuNDQ4NCAzMC44NTE3IDE0LjcwMDcgMzAuNzgyNkMxMy4yMjIxIDMwLjY0NjEgMTEuNzY5OCAzMC4yODcgMTAuMzkzMyAyOS43MTUxQzguNTk3MTcgMjguOTY5MSA2Ljk2NTE4IDI3Ljg3NTcgNS41OTA1IDI2LjQ5NzFDNC4yMTU4MiAyNS4xMTg3IDMuMTI1MzcgMjMuNDgyMiAyLjM4MTQgMjEuNjgxQzEuNjM3NDQgMTkuODc5OSAxLjI1NDUyIDE3Ljk0OTUgMS4yNTQ1MiAxNkMxLjI1NDUyIDE0LjA1MDYgMS42Mzc0NCAxMi4xMjAxIDIuMzgxNCAxMC4zMTlDMy4xMjUzNyA4LjUxNzk0IDQuMjE1ODIgNi44ODE0MiA1LjU5MDUgNS41MDI5MkM2Ljk2NTE4IDQuMTI0NDIgOC41OTcxNyAzLjAzMDkzIDEwLjM5MzMgMi4yODQ4OUMxMS43Njk4IDEuNzEzMTIgMTMuMjIyMSAxLjM1NDAxIDE0LjcwMDcgMS4yMTc0NUMxNS40NDg0IDEuMTQ4MzggMTYuMDU4NiAxLjc2NTMzIDE2LjA1ODYgMi41MTgzN1Y4Ljg5ODE3QzEyLjE0NzEgOC44OTgyIDguOTc2MzMgMTIuMDc3OCA4Ljk3NjMzIDE2QzguOTc2MzMgMTkuOTIyMyAxMi4xNDcxIDIzLjEwMTkgMTYuMDU4NCAyMy4xMDIxVjguODk4MkMxOS45Njk4IDguODk4MiAyMy4xNDA2IDEyLjA3NzggMjMuMTQwNiAxNkMyMy4xNDA2IDE5LjkyMjMgMTkuOTY5OCAyMy4xMDE5IDE2LjA1ODQgMjMuMTAyMUwxNi4wNTg2IDI5LjQ4MTZaIiBmaWxsPSIjMzgzMThCIi8+CjxwYXRoIGQ9Ik0xNi4wNDI3IDIzLjA9ODJMMTYuMDQyNCA4LjkwMTg2QzE5Ljk2MjcgOC45MDE4NiAyMy4xNDA3IDEyLjA3OTggMjMuMTQwNyAxNkMyMy4xNDA3IDE5LjkyMDIgMTkuOTYyOCAyMy4wOTgyIDE2LjA0MjcgMjMuMDk4MloiIGZpbGw9IiNERjY1NTIiLz4KPC9zdmc+Cg=='
            }
            style={{
              width: 120,
              height: 120,
              borderRadius: 100
            }}
          />

          <div className="">
            <h3 className="text-lg font-semibold text-default-900 text-default-100"
              style={{
                textOverflow: "ellipsis",
                maxWidth: "196px",
                overflow: "hidden",
                maxHeight: "40px",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                whiteSpace: "normal"
              }}
            >
              {name}
            </h3>
            <p
              className="text-sm text-default-600 dark:text-default-400"
              style={{
                textOverflow: "ellipsis",
                maxWidth: "196px",
                overflow: "hidden",
                maxHeight: "40px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                whiteSpace: "normal"
              }}
            >
              {description}
            </p>
            <p className="text-md text-default-700 mt-4">
              { balanceFetch ? "Fetching balance..." : typeof totalBalance === "number" ? `${totalBalance.toFixed(2)} CRC` : "No balance available" } 
              <span   
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "orange"
                }}>
                { !balanceFetch && typeof mintable === "number"  ? `(+${mintable.toFixed(2)})` : "" }
              </span>
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

