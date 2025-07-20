import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@heroui/react";

type Props = {
  name?: string;
  privateKey?: string;
  publicKey?: string;
};

export default function CardComponent(props: Props) {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="heroui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{props.name}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{props.publicKey}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <div>
          <p className="text-sm text-default-500">Circle accounts:</p>
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/heroui-inc/heroui"
          >
            Visit source code on GitHub.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
