interface Props {
  data: any;
}

// TODO(PaoloTolentino): Add Recommendations API here
const HomeRecommendationList = (props: Props) => {
  const nums = Array.from(Array(10).keys());
  return (
    <div className="flex flex-col">
      <h4 className="text-xl font-extrabold">You might like this:</h4>
      <div className="flex justify-start space-x-4 overflow-x-auto p-4">
        {nums.map((num, i) => {
          return (
            <div
              key={num}
              className="w-72 flex-shrink-0 rounded-xl bg-blue-400 bg-opacity-50 p-4 text-black shadow-md"
            >
              <h5 className="font-bold">SQL Hero Mastery</h5>
              <p className="text-xs">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel
                similique dignissimos nostrum. Aliquam ratione accusantium
                consectetur mollitia? Eaque dignissimos exercitationem accusamus
                ullam aliquid expedita, facilis eos, maxime, consequatur harum
                culpa.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default HomeRecommendationList;
