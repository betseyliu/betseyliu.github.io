import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { TextLayer, ScatterplotLayer, ArcLayer } from '@deck.gl/layers';
import { MapView } from '@deck.gl/core';
import { StaticMap } from 'react-map-gl';
import './map.scss';
import { poi, colors, links } from './poi.json';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiYmV0c2V5bGl1IiwiYSI6ImNrZ2tqM3ZuNDBqc2szMW5hY2Fqb3V6MjEifQ.UfqpoI0tBrXbCOlTWFHlHA';
const INITIAL_VIEW_STATE = {
  longitude: 85,
  latitude: 44,
  zoom: 2.6,
  pitch: 40,
  bearing: 0,
  minZoom: 2.3,
};

export const Map = () => {
  const [hoverInfo, setHoverInfo] = useState({});
  // 地点文字
  const poiTextLayer = new TextLayer({
    id: 'poi-text-layer',
    data: Object.values(poi),
    getPosition: (d) => d.coordinates,
    getText: (d) => d.name,
    fontFamily: 'Staatliches',
    getColor: (d) => {
      const c = d.priority * 50 + 40;
      return [c, c, c, 255];
    },
    getSize: (d) => d.priority * 3 + 7,
    getPixelOffset: (d) => d.offset || [0, -13],
    pickable: true,
    onHover: (info) => setHoverInfo(info),
  });

  // 地点marker
  const poiPointLayer = new ScatterplotLayer({
    id: 'poi-point-layer',
    data: Object.values(poi),
    filled: true,
    radiusMinPixels: 1.4,
    getPosition: (d) => d.coordinates,
    getFillColor: (d) => colors[d.priority - 1],
    pickable: true,
  });

  const arcLayer = new ArcLayer({
    id: 'arc-layer',
    data: links,
    getWidth: (d) => (poi[d.from].priority + poi[d.to].priority) / 8,
    getSourcePosition: (d) => poi[d.from].coordinates,
    getTargetPosition: (d) => poi[d.to].coordinates,
    getSourceColor: (d) => colors[poi[d.from].priority - 1],
    getTargetColor: (d) => colors[poi[d.to].priority - 1],
  });
  const layers = [poiTextLayer, poiPointLayer, arcLayer];
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      className="test"
      style={{ right: '0px', left: 'auto', width: '1200px' }}
      layers={layers}
    >
      <MapView id="map" width="100%" controller={true}>
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/betseyliu/ckgkg1uif1ool19o8nk8dqg2e"
          attributionControl={false}
          logoPosition="bottom-right"
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
