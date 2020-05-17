import OlStyle from 'ol/style/Style'
import OlStroke from 'ol/style/Stroke'
import OlFill from 'ol/style/Fill'
import OlCircle from 'ol/style/Circle'

export function defaultStyle(feature) {
  const geomType = feature.getGeometry().getType()
  const style = new OlStyle({
    fill: new OlFill({
      color: ['MultiPolygon', 'Polygon'].includes(geomType)
        ? '#FF0000'
        : [0, 0, 0, 0]
    }),
    stroke: new OlStroke({
      color: ['MultiPolygon', 'Polygon'].includes(geomType)
        ? '#FF0000'
        : '#FF0000',
      width: 3
    }),
    image: new OlCircle({
      radius: 7,
      fill: new OlFill({
        color: '#FF0000'
      })
    })
  })
  return [style]
}

/**
 * Style used for popup selected feature highlight
 */

export function popupInfoStyle() {
  // MAJK: PopupInfo layer style (used for highlight)
  const styles = []
  styles.push(
    new OlStyle({
      stroke: new OlStroke({
        color: 'rgba(236, 236, 236, 0.7)',
        width: 20
      })
    })
  )
  styles.push(
    new OlStyle({
      fill: new OlFill({
        color: 'rgba(255,0,0, 0.2)'
      }),
      stroke: new OlStroke({
        color: '#ff0000',
        width: 4
      }),
      image: new OlCircle({
        radius: 7,
        fill: new OlFill({
          color: '#ff0000'
        })
      })
    })
  )

  return styles
}

/**
 * Style function used for vector layers.
 */
const styleCache = {}
export function baseStyle(propertyName, config) {
  const styleFunction = feature => {
    const propertyValue = feature.get(propertyName)
    if (propertyValue && !styleCache[propertyValue]) {
      const {
        strokeColor,
        strokeWidth,
        lineDash,
        fillColor,
        circleRadiusFn
      } = config
      const geometryType = feature.getGeometry().getType()
      switch (geometryType) {
        /**
         * Style used for geometry point type. It will render a circle based on the given formula
         */
        case 'Point':
        case 'MultiPoint': {
          styleCache[propertyValue] = new OlStyle({
            image: new OlCircle({
              stroke: new OlStroke({
                color: strokeColor || 'rgba(255, 255, 255, 1)',
                width: strokeWidth || 1
              }),
              fill: new OlFill({
                color: fillColor || 'rgba(129, 56, 17, 0.7)'
              }),
              radius: circleRadiusFn ? circleRadiusFn(propertyValue) : 5
            })
          })
          break
        }
        /**
         * Style used for line geometry type.
         */
        case 'LineString':
        case 'MultiLineString': {
          styleCache[propertyValue] = new OlStyle({
            stroke: new OlStroke({
              color:
                strokeColor instanceof Function
                  ? strokeColor()
                  : strokeColor || 'rgba(255, 255, 255, 1)',
              width: strokeWidth || 4,
              lineDash: lineDash || [6]
            })
          })
          break
        }
        default:
          break
      }
    }
    return styleCache[propertyValue] || defaultStyle
  }
  return styleFunction
}