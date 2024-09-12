import logo from "../public/logo.png";
import "./App.css";
import { useOpenWidget } from "@nexeraid/react-sdk";

function App() {
  const openWidget = useOpenWidget();
  return (
    <>
      <div>
        <img src={logo} className="logo" alt="nexeraID logo" />
      </div>
      <h1>Example of a react app in regular mode</h1>
      <div className="card">
        <button
          id="nexera-button"
          disabled={openWidget.isLoading}
          onClick={() => openWidget.mutateAsync()}
        >
          Open Widget
        </button>
      </div>
    </>
  );
}

export default App;
