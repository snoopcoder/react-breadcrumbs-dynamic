import React, { Children } from 'react'
import PropTypes from 'prop-types'

import {
  ThroughProvider,
  throughContainer,
  throughAgent,
  createAdvAgent,
  throughInterface,
} from 'react-through'


export const breadcrumbsThroughArea = 'breadcrumbs'

export const breadcrumbsBearingKey = 'to'

export const withBreadcrumbs = throughInterface(breadcrumbsThroughArea)

export const withBreadcrumbsItem = throughAgent(breadcrumbsThroughArea, breadcrumbsBearingKey)

export const withBreadcrumbsContainer = throughContainer(breadcrumbsThroughArea)

export const Dummy = () => null

export const Item = () => null

export const BreadcrumbsProvider = ThroughProvider

export const BreadcrumbsItem = createAdvAgent(breadcrumbsThroughArea, breadcrumbsBearingKey)


function prepareProps(props, rename, duplicate, remove) {
  const p = Object.assign({}, props)
  Object.keys(duplicate).forEach(k => {
    p[duplicate[k]] = p[k]
  })
  Object.keys(rename).forEach(k => {
    p[rename[k]] = p[k]; delete p[k]
  })
  Object.keys(remove).forEach(k => {
    delete p[k]
  })
  return p
}

const defaultCompare = (a, b) => (
  a[breadcrumbsBearingKey].length - b[breadcrumbsBearingKey].length
)

const defaultRender = (props) => {
  const {
    container: Container,
    containerProps,
    hideIfEmpty,
    item: Item,
    finalItem: FinalItem,
    finalProps,
    separator,
    duplicate,
    remove,
    rename,
    itemsValue,
    count,
    prepareItemProps,
  } = props

  if (hideIfEmpty && count === 0) {
    return null
  }

  return (
      <Container {...containerProps}>
        {itemsValue.map((itemValue, i) => {
          return i+1 < count ? (

              separator ? (
                  <span key={i}>
              <Item {...prepareItemProps(itemValue)} />
                    {separator}
            </span>
              ) : (
                  <Item key={i} {...prepareItemProps(itemValue)} />
              )

          ) : (

              <FinalItem key={i}
                         {...prepareItemProps(itemValue)}
                         {...finalProps}
              />

          )
        })}

      </Container>
  )}

const Breadcrumbs_ = (props) => {
  const {
    container = 'span',
    containerProps,
    hideIfEmpty = false,
    item ='a',
    finalItem = item,
    finalProps = {},
    separator,
    duplicateProps: duplicate = {},
    removeProps: remove  = {},
    renameProps: rename = (item === 'a' ? {to: 'href'} : {}),
    compare,
    render = defaultRender
  } = props
  const data = props[breadcrumbsThroughArea]
  const itemsValue = Object
    .keys(data)
    .map(k => data[k])
    .sort(compare || defaultCompare)
  const count = itemsValue.length

  function prepareItemProps(itemValue) {
    return prepareProps(itemValue, rename, duplicate, remove)
  }

  return render({
    count, itemsValue, finalItem, finalProps, separator, hideIfEmpty,
    containerProps, container, prepareItemProps, item
  })
}

export const Breadcrumbs = withBreadcrumbsContainer(Breadcrumbs_)
