import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { TextLayer, ScatterplotLayer, ArcLayer } from '@deck.gl/layers';
import { MapView } from '@deck.gl/core';
import { StaticMap } from 'react-map-gl';
import './map.scss';
import { poi, colors, links } from './poi.json';

interface PoiProps {
  id: number;
  name: string;
  coordinates: number[];
  priority: number;
  message?: string;
  offset?: number[];
}
interface LinkProps {
  from: string;
  to: string;
}
interface HoverInfoProps {
  x: number;
  y: number;
  object?: PoiProps;
}

const MAPBOX_ACCESS_TOKEN_PROD =
  'pk.eyJ1IjoiYmV0c2V5bGl1IiwiYSI6ImNrZ2tqM3ZuNDBqc2szMW5hY2Fqb3V6MjEifQ.UfqpoI0tBrXbCOlTWFHlHA';
const MAPBOX_ACCESS_TOKEN_DEV =
  'pk.eyJ1IjoiYmV0c2V5bGl1IiwiYSI6ImNrZ2xta252aDBkbmgyeG16cHRubW92MWEifQ.64uPMfg3PumqVO_ti5QwAA';
const INITIAL_VIEW_STATE = {
  longitude: 85,
  latitude: 44,
  zoom: 2.6,
  pitch: 40,
  bearing: 0,
  minZoom: 2.3,
};

export default () => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfoProps>({ x: 0, y: 0 });
  // 地点文字
  const poiTextLayer = new TextLayer({
    id: 'poi-text-layer',
    data: Object.values(poi),
    getPosition: (d: PoiProps) => d.coordinates,
    getText: (d: PoiProps) => d.name,
    fontFamily: 'Staatliches',
    getColor: (d: PoiProps) => {
      const c = d.priority * 50 + 40;
      return [c, c, c, 255];
    },
    getSize: (d: PoiProps) => d.priority * 3 + 7,
    getPixelOffset: (d: PoiProps) => d.offset || [0, -13],
    pickable: true,
    onHover: (info) => setHoverInfo(info),
  });

  // 地点marker
  const poiPointLayer = new ScatterplotLayer({
    id: 'poi-point-layer',
    data: Object.values(poi),
    filled: true,
    radiusMinPixels: 1.4,
    getPosition: (d: PoiProps) => d.coordinates,
    getFillColor: (d: PoiProps) => colors[d.priority - 1],
    pickable: true,
  });

  const arcLayer = new ArcLayer({
    id: 'arc-layer',
    data: links,
    getWidth: (d: LinkProps) => (poi[d.from].priority + poi[d.to].priority) / 8,
    getSourcePosition: (d: LinkProps) => poi[d.from].coordinates,
    getTargetPosition: (d: LinkProps) => poi[d.to].coordinates,
    getSourceColor: (d: LinkProps) => colors[poi[d.from].priority - 1],
    getTargetColor: (d: LinkProps) => colors[poi[d.to].priority - 1],
  });
  const layers = [poiTextLayer, poiPointLayer, arcLayer];
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      style={{ right: '0px', left: 'auto', width: '1200px' }}
      layers={layers}
    >
      <MapView key="map" id="map" width="100%" controller={true}>
        <StaticMap
          width="100%"
          height="100%"
          key="map"
          mapboxApiAccessToken={
            // process.env.NODE_ENV === 'development'
            // ? MAPBOX_ACCESS_TOKEN_DEV
            // : MAPBOX_ACCESS_TOKEN_PROD
            MAPBOX_ACCESS_TOKEN_DEV
          }
          mapStyle="mapbox://styles/betseyliu/ckgkg1uif1ool19o8nk8dqg2e"
          attributionControl={false}
        />
        {hoverInfo.object && hoverInfo.object.message && (
          <div
            className="map-tooltip"
            style={{ left: hoverInfo.x, top: hoverInfo.y }}
          >
            {hoverInfo.object.message}
          </div>
        )}
      </MapView>
    </DeckGL>
  );
};
