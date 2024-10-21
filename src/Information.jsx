import "./Information.css";

function Information({ xValue, yValue, angleValue }) {
  return (
    <>
      <div className="container3">
        <div>
          x:- <span id="xco">{xValue}</span>
          y:- <span id="yco">{yValue}</span>
          Direction:- <span id="dir">{angleValue}</span>
        </div>
      </div>
    </>
  );
}

export default Information;
