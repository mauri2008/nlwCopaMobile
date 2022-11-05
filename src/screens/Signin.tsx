import { Center, Text, Icon } from "native-base";
import { Fontisto } from '@expo/vector-icons'


import { useAuth } from "../hooks/useAuth";

import Logo from '../assets/logo.svg';
import { Button } from "../components/Button";

export function Signin() {
    const { signin, user, iseUserloading } = useAuth()

    return (
        <Center flex={1} bgColor="gray.900" p={7}>
            <Logo width={212} height={40} />

            <Button
                title="Entrar com Google"
                leftIcon={<Icon as={Fontisto} name="google" color='white' size='md' />}
                type='SECONDARY'
                mt={12}
                onPress={signin}
                isLoading={iseUserloading}
                _loading={{ _spinner: { color: 'white' } }}
            />
            <Text
                color="white"
                textAlign="center"
                mt={4}
            >
                Não utilizamos nenhuma informação além {'\n'} do seu e-mail para criação de sua conta
            </Text>
        </Center>
    )
}