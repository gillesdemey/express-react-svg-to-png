import React from "react";
import { Group } from "@visx/group";
import { scaleTime, scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "@visx/curve";
import { LinePath } from "@visx/shape";
import { appleStock } from "@visx/mock-data";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { extent } from "d3-array";
import { GridColumns, GridRows } from "@visx/grid";
import { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";

const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 36,
};

const Graph = ({ width = 500, height = 300 }) => {
  const data = appleStock;

  // accessors
  const getDate = (d: AppleStock) => new Date(d.date);
  const getStockValue = (d: AppleStock) => d.close;

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scales
  const xScale = scaleTime({
    range: [0, innerWidth],
    domain: extent(data, getDate),
    nice: false,
  });

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: extent(data, getStockValue),
    nice: true,
  });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <GridRows
          scale={yScale}
          width={innerWidth}
          height={innerHeight}
          stroke={"rgba(0,0,0,0.1)"}
        />
        <GridColumns
          scale={xScale}
          width={innerWidth}
          height={innerHeight}
          stroke={"rgba(0,0,0,0.1)"}
        />
        <LinePath
          data={data}
          x={(d) => xScale(getDate(d)) ?? 0}
          y={(d) => yScale(getStockValue(d)) ?? 0}
          strokeWidth={1}
          stroke="#7eb26e"
          shapeRendering="geometricPrecision"
          curve={curveMonotoneX}
        />
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          tickFormat={(v) => (v as Date).toLocaleDateString("en-US")}
          hideAxisLine={true}
          hideTicks={true}
        />
        <AxisLeft scale={yScale} stroke={"rgba(0,0,0,0.1)"} hideTicks={true} />
      </Group>
    </svg>
  );
};

export default Graph;
