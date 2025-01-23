import React from 'react'

import Styles from './icon-styles.scss'

export enum IconName {
  thumbDown = '/images/icon-thumb-down.png',
  thumbUp = '/images/icon-thumb-up.png'
}

type Props = {
  iconName: IconName
  className?: string
}

const Icon: React.FC<Props> = ({ iconName, className }) => {
  const iconColor = iconName === IconName.thumbDown ? Styles.red : Styles.green

  return (
    <div className={[Styles.iconWrap, iconColor, className].join(' ')}>
      <img
        data-testid="icon"
        className={Styles.icon}
        src={iconName}
      />
    </div>
  )
}

export default Icon
