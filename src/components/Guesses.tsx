import { Box, FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game'
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Share } from 'react-native';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {

  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondsTeamPoints, setSecondsTeamPoints] = useState('')

  const toast = useToast()

  async function fetchGames() {
    try {
      setIsLoading(true)
      const response = await api.get(`/pool/${poolId}/games`);

      setGames(response.data.games)

      console.log('Guesse =>', response.data.games)

    } catch (error) {
      console.log('Deu ruim', error)
      toast.show({
        title: 'Não foi possivel carregar os jogos',
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
      message: code
    })
  }

  async function handlerGuessConfirm(gameId: string) {
    try {
      setIsLoading(true)
      if (!firstTeamPoints.trim() || !secondsTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o valor do palpite',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondsTeamPoints)
      })

      toast.show({
        title: 'Palpite enviado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGames()

    } catch (error) {
      console.log('Deu ruim', error)
      toast.show({
        title: 'Não foi possivel enviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])


  if (isLoading) {
    return <Loading />
  }

  return (

    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondsTeamPoints}
          onGuessConfirm={() => handlerGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} hanleCodeShare={hanleCodeShare} />}
    />

  );
}
