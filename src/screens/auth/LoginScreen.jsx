import { StyleSheet, Text, View, TextInput, Pressable, Dimensions,Platform, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../global/colors'
import { useState, useEffect } from 'react';
import { setUser } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../services/authService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { insertSession, clearSessions } from '../../db';

const textInputWidth = Dimensions.get('window').width * 0.7

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const dispatch = useDispatch()

    const [triggerLogin, result] = useLoginMutation()

    useEffect(() => {
        if (result.isSuccess) {
            console.log("Usuario logueado con éxito")
            console.log(result.data)
            dispatch(setUser(result.data))

            if (rememberMe) {
                clearSessions().then(() => console.log("sesiones eliminadas")).catch(error => console.log("Error al eliminar las sesiones: ", error))
                console.log("result data:", result.data)
                insertSession({
                    localId: result.data.localId,
                    email: result.data.email,
                    token: result.data.idToken
                })
                    .then(res => console.log("Usuario insertado con éxito", res))
                    .catch(error => console.log("Error al insertar usuario", error))
            }

        }
    }, [result, rememberMe])

    const onsubmit = () => {     
        triggerLogin({ email, password })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <LinearGradient
                colors={['#400962', '#11001B']}
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }}   
                style={styles.gradient}
            >
                <Text style={styles.title}>Forno Del Paese</Text>
                <Text style={styles.subTitle}>Ingresa</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        onChangeText={(text) => setEmail(text)}
                        placeholderTextColor="#EBEBEB"
                        placeholder="Email"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        placeholderTextColor="#EBEBEB"
                        placeholder='Password'
                        style={styles.textInput}
                        secureTextEntry
                    />

                </View>
                <View style={styles.rememberMeContainer}>
                    <Text style={styles.whiteText}>Mantener sesión iniciada</Text>
                    {
                        rememberMe
                            ?
                            <Pressable onPress={() => setRememberMe(!rememberMe)}><Icon name="toggle-on" size={48} color={colors.Verdecito} /></Pressable>
                            :
                            <Pressable onPress={() => setRememberMe(!rememberMe)}><Icon name="toggle-off" size={48} color={colors.Gris} /></Pressable>
                    }
                </View>
                <View style={styles.footTextContainer}>
                    <Text style={styles.whiteText}>¿No tienes una cuenta?</Text>
                    <Pressable onPress={() => navigation.navigate('Signup')}>
                        <Text style={
                            {
                                ...styles.whiteText,
                                ...styles.underLineText
                            }
                        }>
                            Crea una
                        </Text>
                    </Pressable>
                </View>

                <Pressable style={styles.btn} onPress={onsubmit}><Text style={styles.btnText}>Iniciar sesión</Text></Pressable>

                <View style={styles.guestOptionContainer}>
                    <Text style={styles.whiteText}>¿Solo quieres dar un vistazo?</Text>
                    <Pressable onPress={() => dispatch(setUser({ email: "demo@fornodelpaese.com", token: "demo" }))}>
                        <Text style={{ ...styles.whiteText, ...styles.strongText }}>Ingresa como invitado</Text>
                    </Pressable>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex:1
    },  
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: colors.Verdecito,
        fontFamily: "PressStart2P",
        fontSize: 24
    },
    subTitle: {
        fontFamily: "Montserrat",
        fontSize: 18,
        color: colors.Naranja,
        fontWeight: '700',
        letterSpacing: 3
    },
    inputContainer: {
        gap: 16,
        margin: 16,
        marginTop: 48,
        alignItems: 'center',

    },
    textInput: {
        padding: 8,
        paddingLeft: 16,
        borderRadius: 16,
        backgroundColor: "#95859E",
        width: textInputWidth,
        color: colors.Blanco,
    },
    footTextContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    whiteText: {
        color: colors.Blanco
    },
    underLineText: {
        textDecorationLine: 'underline',
    },
    strongText: {
        fontWeight: '900',
        fontSize: 16
    },
    btn: {
        padding: 16,
        paddingHorizontal: 32,
        backgroundColor: colors.Naranja,
        borderRadius: 16,
        marginTop: 32
    },
    btnText: {
        color: colors.Blanco,
        fontSize: 16,
        fontWeight: '700'
    },
    guestOptionContainer: {
        alignItems: 'center',
        marginTop: 64
    },
    rememberMeContainer: {
        flexDirection: "row",
        gap: 5,
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 8,
    }
})