import { Service } from "app/utils/constants";
import { Modal } from "";

export default function EditEventModal(props) {
  const { show, isEdit = false, moduleId = 0, moduleName } = props;

  const getFormComponent = () => {
    switch (moduleName) {
      case Service:
        return <>Service form</>;
        break;
      default:
        return <>Invalid module name</>;
    }
  };

  return <>{getFormComponent()}</>;
}
