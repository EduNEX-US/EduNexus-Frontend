const Controls = ({
  micOn,
  camOn,
  toggleMic,
  toggleCamera,
  shareScreen,
}: any) => {
  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={toggleMic}>
        {micOn ? "Mute" : "Unmute"}
      </button>

      <button onClick={toggleCamera}>
        {camOn ? "Camera Off" : "Camera On"}
      </button>

      <button onClick={shareScreen}>Share Screen</button>
    </div>
  );
};

export default Controls;
