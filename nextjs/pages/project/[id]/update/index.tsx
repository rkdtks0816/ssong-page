import { useRouter } from "next/router";
import WriteForm from "@/components/common/WriteForm";

const ProjectUpdate: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return <WriteForm isBlog={false} postId={id as string} />;
};

export default ProjectUpdate;
