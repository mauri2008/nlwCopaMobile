import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../services/api";

import { PoolCardPros } from '../components/PoolCard'
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";

interface RouteParams {
    id: string
}

export function Details() {
    const route = useRoute()
    const { id } = route.params as RouteParams;
    const [isLoading, setIsLoading] = useState(true)
    const [poolsDetails, setPoolsDetails] = useState<PoolCardPros>({} as PoolCardPros)
    const [optionSelected, setOptionSelected] = useState<'guesses' | 'Ranking'>('guesses')

    const toast = useToast()

    async function fatchPoolDatail() {
        try {
            const response = await api.get(`/pools/${id}`);

            setPoolsDetails(response.data.pools)
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possivel carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        finally {
            setIsLoading(false)
        }
    }

    async function hanleCodeShare() {
        await Share.share({
            message: poolsDetails.code
        })
    }

    useEffect(() => {
        fatchPoolDatail()
    }, [id])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title={poolsDetails.title} showBackButton showShareButton onShare={hanleCodeShare} />
            {
                poolsDetails._count?.Participant > 0 ?
                    <VStack px={5} flex={1}>
                        <PoolHeader data={poolsDetails} />

                        <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
                            <Option
                                title="Seus palpites "
                                isSelected={optionSelected === 'guesses'}
                                onPress={() => setOptionSelected("guesses")}
                            />
                            <Option
                                title="Ranking do Grupo"
                                isSelected={optionSelected === 'Ranking'}
                                onPress={() => setOptionSelected("Ranking")}
                            />
                        </HStack>

                        <Guesses poolId={poolsDetails.id} code={poolsDetails.code} />

                    </VStack>
                    :
                    <EmptyMyPoolList code={poolsDetails.code} hanleCodeShare={hanleCodeShare} />

            }
        </VStack>
    )
}