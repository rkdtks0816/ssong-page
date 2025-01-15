import { useRouter } from "next/router";
import WriteForm from "@/components/common/WriteForm";

const BlogUpdate: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return <WriteForm isBlog={true} postId={id as string} />;
};

export default BlogUpdate;
