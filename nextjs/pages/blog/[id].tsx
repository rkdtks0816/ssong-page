import Detail from "@/components/common/Detail";
import { COLLECTIONS, PATHS } from "@/shared/constants";
import { useRouter } from "next/router";

const BlogDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Detail
      redirect={PATHS.BLOG.ROOT}
      collection={COLLECTIONS.BLOG.POSTS}
      id={id as string}
    />
  );
};

export default BlogDetail;
