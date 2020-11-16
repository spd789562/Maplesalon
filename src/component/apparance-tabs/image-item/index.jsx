import { Fragment, memo } from 'react'

const ImageItem = ({
  style,
  name,
  isSelected,
  src,
  hasItem = false,
  imageHeight = 60,
  paddingTop = 0,
  handleChange,
}) => (
  <figure
    style={style}
    className={`item ${isSelected ? 'item__selected' : ''}`}
    onClick={handleChange}
  >
    {hasItem && (
      <Fragment>
        <div className="item-icon">
          <img src={src} alt="not found" />
        </div>
        <figcaption className="item-name">{name}</figcaption>
      </Fragment>
    )}
    <style jsx>{`
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        padding-top: ${paddingTop}px;
      }
      .item__selected {
        background-color: #c1c8f1;
      }
      .item-icon {
        height: ${imageHeight}px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .item-icon > img {
        max-height: 100%;
      }
      .item-name {
        padding-left: 8px;
        padding-right: 8px;
        text-align: center;
        word-break: break-all;
      }
    `}</style>
  </figure>
)

export default memo(ImageItem)
