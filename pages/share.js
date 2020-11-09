import React, { useMemo, memo } from 'react'

/* component */

/* mapping */

/* helper */
import { withTranslation } from '../src/i18n'

function Share({ t, i18n }) {
  // const TabComponent = useMemo(() => TabMapping[tab].Component, [tab])
  return useMemo(() => <div>123</div>, [])
}

Share.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(memo(Share))
