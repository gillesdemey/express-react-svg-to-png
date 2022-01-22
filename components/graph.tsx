import React from "react";

import { Group } from "@visx/group";
import { scaleTime, scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "@visx/curve";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { appleStock } from "@visx/mock-data";
import { extent } from "d3-array";
import { GridColumns, GridRows } from "@visx/grid";
import { classicColors } from "@grafana/data";
import { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";

const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 36,
};

const GRID_COLOR = "rgba(0,0,0,0.1)";

const Graph = ({ width = 500, height = 300 }) => {
  const series = [appleStock];

  // accessors
  const getDate = (d: AppleStock) => new Date(d.date);
  const getValue = (d: AppleStock) => d.close;

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scales
  const xScale = scaleTime({
    range: [0, innerWidth],
    domain: extent(series[0], getDate),
    nice: false,
  });

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: extent(series[0], getValue),
    nice: true,
  });

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#FFF" />
      <Group left={margin.left} top={margin.top}>
        <GridRows
          scale={yScale}
          width={innerWidth}
          height={innerHeight}
          stroke={GRID_COLOR}
        />
        <GridColumns
          scale={xScale}
          width={innerWidth}
          height={innerHeight}
          stroke={GRID_COLOR}
        />
        {series.map((serie, index: number) => (
          <LinePath
            key={index}
            data={serie}
            x={(d) => xScale(getDate(d)) ?? 0}
            y={(d) => yScale(getValue(d)) ?? 0}
            strokeWidth={1}
            stroke={classicColors[index % classicColors.length]}
            curve={curveMonotoneX}
          />
        ))}
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          tickFormat={(v) => (v as Date).toLocaleDateString("en-US")}
          hideAxisLine={true}
          hideTicks={true}
          numTicks={6}
        />
        <AxisLeft scale={yScale} stroke={GRID_COLOR} hideTicks={true} />
      </Group>
    </svg>
  );
};

export default Graph;
