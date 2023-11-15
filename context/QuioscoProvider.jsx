import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const QuioscoContext = createContext()

const QuioscoProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([])
  const [categoriaActual, setCategoriaActual] = useState({})
  const [producto, setProducto] = useState({})
  const [modal, setModal] = useState(false)
  const [pedido, setPedido] = useState([])
  const [nombre, setNombre] = useState('')
  const [total, setTotal] = useState(0)
  const router = useRouter()

  const obtenerCategorias = async () => {
    const { data } = await axios('/api/categorias')
    setCategorias(data)
  }

  useEffect(() => {
    obtenerCategorias()
  }, [])

  useEffect(() => {
    const nuevoTotal = pedido.reduce((total, producto) => (total + producto.precio * producto.cantidad) + total, 0)
    setTotal(nuevoTotal)
  }, [pedido])

  useEffect(() => {
    setCategoriaActual(categorias[0])
  }, [categorias])

  const handleClickCategoria = (id) => {
    const categoria = categorias.filter(category => category.id === id)
    setCategoriaActual(categoria[0])
    router.push('/')
  }

  const handleSetProducto = producto => {
    setProducto(producto)
  }
  const handleChangeModal = () => {
    setModal(!modal)
  }
  // Este codigo { categoriaId, imagen, ...producto } es para evitar mostrar categoriaId, imagen y mostrar lo que queda de ...producto
  const handleAgregarPedido = ({ categoriaId, ...producto }) => {
    if (pedido.some(productoState => productoState.id === producto.id)) {
      // Actualizar la cantidad
      const pedidoActualizado = pedido.map(productoState => productoState.id === producto.id ? producto : productoState)
      setPedido(pedidoActualizado)
      toast.success('Pedido Actualizado')
    } else {
      setPedido([...pedido, producto])
      toast.success('Pedido Agregado')
    }
    setModal(false)
  }

  const handleEditarCantidad = id => {
    const productoActualizado = pedido.filter(producto => producto.id === id)
    setProducto(productoActualizado[0])
    setModal(!modal)
  }

  const handleEliminarProducto = id => {
    const pedidoActualizado = pedido.filter(producto => producto.id !== id)
    setPedido(pedidoActualizado)
    toast.success('Producto Eliminado')
  }

  const colocarOrden = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/ordenes', { pedido, nombre, total, fecha: Date.now().toString() })
      // Resetear la APP
      setCategoriaActual(categorias[0])
      setPedido([])
      setNombre([])
      setTotal(0)
      toast.success('Pedido Realizado Correctamente')
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <QuioscoContext.Provider
      value={{
        categorias,
        categoriaActual,
        producto,
        modal,
        pedido,
        nombre,
        total,
        setNombre,
        handleClickCategoria,
        handleSetProducto,
        handleChangeModal,
        handleAgregarPedido,
        handleEditarCantidad,
        handleEliminarProducto,
        colocarOrden
      }}
    >
      {children}
    </QuioscoContext.Provider>
  )
}

export {
  QuioscoProvider
}
export default QuioscoContext
