import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View, Image, Pressable,ActivityIndicator } from 'react-native'
import products from '../data/products.json'
import FlatCard from '../components/FlatCard'
import { colors } from '../global/colors'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Search from '../components/Search'
import { useSelector,useDispatch } from 'react-redux'
import { useGetProductsByCategoryQuery } from '../services/shopService'
import { setProductId } from '../features/shop/shopSlice'

const ProductsScreen = ({ navigation, route }) => {
    const [productsFiltered, setProductsFiltered] = useState([])
    const [search, setSearch] = useState("")
    const category = useSelector(state => state.shopReducer.value.categorySelected)
    const { data: productsFilteredByCategory, error, isLoading } = useGetProductsByCategoryQuery(category)

    dispatch = useDispatch()

    useEffect(() => {
        setProductsFiltered(productsFilteredByCategory)
        if (search) {
            setProductsFiltered(productsFilteredByCategory.filter(product => product.title.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search,productsFilteredByCategory])

    const renderProductItem = ({ item }) => {
        return (
            <Pressable onPress={() => {
                dispatch(setProductId(item.id))
                navigation.navigate("Producto")
                }}>
                <FlatCard style={styles.productContainer}>
                    <View>
                        <Image
                            source={{ uri: item.mainImage }}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.productDescription}>
                        <Text style={styles.productTitle}>{item.title}</Text>
                        <Text style={styles.shortDescription}>{item.shortDescription}</Text>
                        <View style={styles.tags}>
                            <Text style={styles.tagText}>Tags : </Text>
                            {
                                <FlatList
                                    style={styles.tags}
                                    data={item.tags}
                                    keyExtractor={() => Math.random()}
                                    renderItem={({ item }) => (<Text style={styles.tagText}>{item}</Text>)}
                                />
                            }
                        </View>
                        {
                            item.discount > 0 && <View style={styles.discount}><Text style={styles.discountText}>Descuento {item.discount} %</Text></View>
                        }
                        {
                            item.stock <= 0 && <Text style={styles.noStockText}>Sin Stock</Text>
                        }
                        <Text style={styles.price}>Precio: $ {item.price}</Text>
                    </View>
                </FlatCard>
            </Pressable>
        )
    }




    return (
        <>
            {
                isLoading
                    ?
                    <ActivityIndicator size="large" color={colors.Verdecito} />
                    :
                    error
                        ?
                        <Text>Error al cargar las categorías</Text>
                        :
                        <>
                            <Pressable onPress={() => navigation.goBack()}><Icon style={styles.goBack} name="arrow-back-ios" size={24} /></Pressable>
                            <Search setSearch={setSearch} />
                            <FlatList
                                data={productsFiltered}
                                keyExtractor={item => item.id}
                                renderItem={renderProductItem}
                            />
                        </>
            }

        </>
    )
}

export default ProductsScreen

const styles = StyleSheet.create({
    productContainer: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: "flex-start",
        margin: 10,
        alignItems: "center",
        gap: 10
    },
    productImage: {
        width: 100,
        height: 100
    },
    productDescription: {
        width: "80%",
        padding: 20,
        gap: 10
    },
    productTitle: {
        fontFamily: 'Montserrat',
        fontWeight: '700',
        fontSize: 18
    },
    shortDescription: {

    },
    tags: {
        flexDirection: 'row',
        gap: 5
    },
    tagText: {
        fontWeight: '600',
        fontSize: 12,
        color: colors.Negro
    },
    price: {
        fontWeight: '800',
        fontSize: 18
    },
    discount: {
        backgroundColor: colors.Naranja,
        padding: 8,
        borderRadius: 12,
        alignSelf: 'flex-start'
    },
    discountText: {
        color: colors.Blanco
    },
    noStockText: {
        color: 'red'
    },
    goBack: {
        padding: 10,
        color: colors.Grissuave
    }
})