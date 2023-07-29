import { createRoot } from 'react-dom/client'

import { Router } from '@/presentation/components'
import { makeLogin } from './factories/pages/login/login-factory'
import '@/presentation/styles/global.scss'

const container = document.getElementById('main')
const root = createRoot(container)

root.render(<Router makeLogin={makeLogin} />)
