import { LeftOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import "./editorperson.css";

const EditorPerson = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="editorperson-header">
        <div onClick={() => navigate(-1)}>
          <LeftOutline />
        </div>
        <div className="editorperson-header-title">编辑资料</div>
      </div>
    </div>
  );
};

export default EditorPerson;
