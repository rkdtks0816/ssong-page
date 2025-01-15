import Detail from "@/components/common/Detail";
import { useRouter } from "next/router";

const BlogDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Detail
      isBlog={true}
      id={id as string}
    />
  );
};

export default BlogDetail;
