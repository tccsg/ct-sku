import { Route, createBrowserRouter, createRoutesFromElements, redirect } from 'react-router-dom'

import { ErrorBoundary } from './error'
import Home from './routes/home'
import Index, * as index from './routes/index'
import Welcome from './routes/welcome'
import Login from './routes/welcome/login'
import queryClient from './vendor/queryClient'
import Sku from './routes/sku'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundary />}>
      <Route element={<Welcome />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/" element={<Index />} loader={index.loader(queryClient)}>
        <Route index loader={() => redirect('home/sku')} />
        <Route path="home" element={<Home />}>
          {/* other route */}
          <Route path="sku" element={<Sku />} />
        </Route>
        <Route path="*" />
        <Route path="404" />
      </Route>
    </Route>
  )
)

export default router
