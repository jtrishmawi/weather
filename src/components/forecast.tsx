import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getWMOCode, getWMOImageUrl } from "@/lib/wmo-codes";

const ForecastList = ({
  casts,
}: {
  casts: {
    temperature2mMax: number;
    temperature2mMin: number;
    weatherCode: number;
    time: Date;
  }[];
}) => {
  return (
    <ScrollArea className="h-96">
      {casts.map((cast, index) => {
        return (
          <div
            key={index}
            className="flex justify-between items-center border rounded-sm mb-2 px-4"
          >
            <div className="flex gap-2 items-center">
              <img
                src={getWMOImageUrl(cast.weatherCode.toString())}
                alt={getWMOCode(cast.weatherCode.toString())}
              />
              <div>
                <span>{cast.temperature2mMax.toFixed(0)}°C</span>/
                <span>{cast.temperature2mMin.toFixed(0)}°C</span>
              </div>
            </div>
            <div>{cast.time.toDateString()}</div>
          </div>
        );
      })}
    </ScrollArea>
  );
};

type ForecastProps = {
  time: Date[];
  temperature2mMax: Float32Array;
  temperature2mMin: Float32Array;
  weatherCode: Float32Array;
};

export const Forecast = (data: ForecastProps) => {
  const casts = data.time.map((time, index) => {
    return {
      temperature2mMax: data.temperature2mMax[index],
      temperature2mMin: data.temperature2mMin[index],
      weatherCode: data.weatherCode[index],
      time: time,
    };
  });

  return (
    <Tabs defaultValue="three_days">
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Forecast
        </h2>
        <TabsList>
          <TabsTrigger value="three_days">3 days</TabsTrigger>
          <TabsTrigger value="all">{casts.length} days</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="three_days">
        <ForecastList casts={[...casts].slice(0, 3)} />
      </TabsContent>
      <TabsContent value="all">
        <ForecastList casts={casts} />
      </TabsContent>
    </Tabs>
  );
};
