/* component */
import { Switch } from 'antd'

/* helper */
import { withTranslation } from '@i18n'

const FrontBackSwitch = ({ t, checked, onChange }) => (
  <Switch
    checkedChildren={t('switch_front')}
    unCheckedChildren={t('switch_back')}
    checked={checked}
    onChange={onChange}
  />
)

FrontBackSwitch.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(FrontBackSwitch)
