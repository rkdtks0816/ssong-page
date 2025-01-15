import Detail from "@/components/common/Detail";
import { useRouter } from "next/router";

const ProjectDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return <Detail isBlog={false} id={id as string} />;
};

export default ProjectDetail;
