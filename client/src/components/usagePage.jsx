const UsagePage = () => {
  return (
    // TODO
    // 1. complete the uperpart of the page
    // 2. complete the graph
    <div className=" mx-5 w-full">
      <div className=" w-full mx-auto  grid grid-cols-3 grid-rows-2">
        <div className=" row-span-2 my-auto">
          <div>
            <img src="" alt="" />
            <div>
              <p>API</p>
              <p>DOCUMENTATION</p>
            </div>
            <img src="" alt="" />
          </div>
          <div>
            <p>powered by</p>
            <p>GebetaMaps</p>
          </div>
        </div>

        <div>
          <div>
            <p>ONM</p>
            <p>endpoint</p>
          </div>
          <div>
            <p>0</p>
            <p>calls</p>
          </div>
        </div>

        <div>
          <div>
            <p>Matrix</p>
            <p>endpoint</p>
          </div>
          <div>
            <p>0</p>
            <p>calls</p>
          </div>
        </div>

        <div>
          <div>
            <p>Direction</p>
            <p>endpoint</p>
          </div>
          <div>
            <p>43</p>
            <p>calls</p>
          </div>
        </div>

        <div>
          <div>
            <p>Tss</p>
            <p>endpoint</p>
          </div>
          <div>
            <p>0</p>
            <p>calls</p>
          </div>
        </div>
      </div>

      <div>{/* graph */}</div>
    </div>
  );
};

export default UsagePage;
