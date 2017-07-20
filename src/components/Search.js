const { createElement } = require('react')
const DOM = require('react-dom-factories')
const Select = require('react-select')
const PropTypes = require('prop-types')
const { div } = DOM

const Search = ({
  items,
  left,
  top,
  onSearch,
  searchValue,
  width
}) =>
  div({ className: 'search box', style: { left, top, width } },
    createElement(Select, {
      autofocus: true,
      onChange: (option) => option && onSearch(option.value),
      filterOptions: (options, filterValue, excludeOptions, props) => {
        filterValue = filterValue.toLowerCase()
        return options.filter(option =>
          option.label.toLowerCase().includes(filterValue) ||
          option.tags.some(tag => tag.toLowerCase().includes(filterValue)) ||
          option.aliases.some(alias => alias.toLowerCase().includes(filterValue))
        )
      },
      openAfterFocus: true,
      options: items.map((item, idx) => ({
        label: item.name,
        value: item.uid,
        tags: item.tags,
        aliases: item.aliases
      })),
      placeholder: 'Search',
      value: searchValue
    })
  )

Search.propTypes = {
  items: PropTypes.array.isRequired,
  left: PropTypes.number.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  top: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

module.exports = Search
