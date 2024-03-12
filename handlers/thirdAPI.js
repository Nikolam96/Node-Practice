const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const getCity = async (req, res) => {
  try {
    let cache = {};
    const key = "2cf6f21794e165121aab02c23946cc7e";
    const urlW = `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${key}`;

    if (
      cache[req.params.city] &&
      cache[req.params.city].cacheTime !== null &&
      cache[req.params.city].cacheTime + 60 * 1000 < Date.now()
    ) {
      cache[req.params.city].localCache = null;
    }

    if (!cache[req.params.city] || cache[req.params.city].localCache === null) {
      const getCity = await fetch(urlW);

      cache[req.params.city] = {
        localCache: await getCity.json(),
        cacheTime: Date.now(),
      };

      res.send(cache);
    }
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  getCity,
};
