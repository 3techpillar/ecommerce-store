import countries from "world-countries";

const formattedCurrencies = countries
  .filter((country) => country.currencies)
  .map((country) => {
    const currencyCode = Object.keys(country.currencies)[0];
    const currencyData = country.currencies[currencyCode];

    return {
      value: currencyCode,
      label: currencyData?.name,
      symbol: currencyData?.symbol,
      flag: country.flag,
      country: country.name.common,
    };
  })
  .filter(
    (currency, index, self) =>
      index === self.findIndex((c) => c.value === currency.value)
  );

const useCurrencies = () => {
  const getAll = () => formattedCurrencies;

  const getByValue = (value: string) => {
    return formattedCurrencies.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useCurrencies;
