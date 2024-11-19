import { StyleSheet, Text, FlatList } from 'react-native'
import receipts from '../data/receipts.json'
import FlatCard from '../components/FlatCard'
import { colors } from '../global/colors'
import  Icon  from 'react-native-vector-icons/MaterialIcons'

const ReceiptsScreen = () => {

  const renderReceiptItem = ({ item }) => {
    let total = item.items.reduce((acumulador, item) => (acumulador += item.quantity * item.price), 0)

    dateOptions ={
      year: 'numeric',      
      month: '2-digit',     
      day: '2-digit',       
      hour: '2-digit',      
      minute: '2-digit',    
      hour12: false         
    };

    return (
      <FlatCard style={styles.receiptContainer}>
        <Text style={styles.title}>Recibo nro: {item.id}</Text>
        <Text style={styles.date}>Creado el {new Date(item.createdAt).toLocaleString('es-Ar',dateOptions)} Hs.</Text>
        <Text style={styles.total}>Total: {total} </Text>
        <Icon name="visibility" size={24} color={colors.grisOscuro} style={styles.viewIcon} />
      </FlatCard>
    )
  }

  return (
    <FlatList
      data={receipts}
      keyExtractor={item => item.id}
      renderItem={renderReceiptItem}
    />
  )
}

export default ReceiptsScreen

const styles = StyleSheet.create({
  receiptContainer: {
    padding: 20,
    justifyContent: "flex-start",
    margin: 16,
    gap: 10,
  },
  title: {
    fontWeight: '700'
  },
  total: {
    fontSize: 16,
    fontWeight: '700'
  },
  viewIcon: {
    alignSelf: 'flex-end'
  }
})