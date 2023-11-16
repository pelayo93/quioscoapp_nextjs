import useSWR from 'swr'
import axios from 'axios'

import AdminLayout from '../layaout/AdminLayaout'
import Orden from '../components/Orden'

export default function Admin () {
  const fetcher = () => axios('/api/ordenes').then(datos => datos.data)
  const { data } = useSWR('/api/ordenes', fetcher, { refreshInterval: 100 })
  console.log(data)

  return (
    <AdminLayout pagina='Admin'>
      <h1 className='text-4xl font-black'>Panel de Administación</h1>
      <p className='text-2xl my-10'>Administra las Ordenes</p>
      {data && data.length
        ? data.map(orden =>
          <Orden
            key={orden.id}
            orden={orden}
          />
        )
        : <p>No hay ordenes</p>}
    </AdminLayout>
  )
}
