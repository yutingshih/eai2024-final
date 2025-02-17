'use client';
/*eslint-disable*/

import { events, stream } from 'fetch-event-stream';
import type { ServerSentEventMessage } from 'fetch-event-stream';

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';
import { Context } from './layout';

export default function Chat() {
  const { history, setHistory } = useContext(Context);
  const [messages, setMessages] = useState<{ "Llama-3.1-8B": Array<{ role: string, content: string }>, "Llama-2-7B": Array<{ role: string, content: string }> }>({ "Llama-3.1-8B": [], "Llama-2-7B": [] });

  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  const [isTransmissionDone, setTransmissionDone] = useState<boolean>(true);
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('Llama-3.1-8B');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '0px 0px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  const handleChange = useCallback((Event: any) => {
    setInputCode(Event.target.value as string);
  }, [setInputCode]);

  const handleTranslate = useCallback(() => {
    setInputOnSubmit(inputCode);
    setOutputCode(" ");

    // Chat post conditions(maximum number of characters, valid message etc.)
    const maxCodeLength = 512;

    // check user input
    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setMessages(prev => {
      if (model == "Llama-3.1-8B") {
        return { "Llama-3.1-8B": [...prev["Llama-3.1-8B"], { role: "system", content: "" }, { role: "user", content: inputCode }], "Llama-2-7B": prev["Llama-2-7B"] };
      } else if (model == "Llama-2-7B") {
        return { "Llama-3.1-8B": prev["Llama-3.1-8B"], "Llama-2-7B": [...prev["Llama-2-7B"], { role: "system", content: "" }, { role: "user", content: inputCode }] };
      } else {
        alert("Unsupport model");
        return prev;
      }
    });
  }, [setInputOnSubmit, inputCode, setOutputCode, setLoading, setMessages]);

  const handleKeyDown = useCallback((e: any) => {
    if (loading)
      return;
    if (e.key != "Enter")
      return;

    setTransmissionDone(false);
    handleTranslate();
  }, [loading, setTransmissionDone, handleTranslate]);

  useEffect(() => {
    if (!loading)
      return;

    setInputCode("");

    const url = model == "Llama-3.1-8B" ? "http://localhost:8080/v1/chat/completions" : "http://localhost:8081/v1/chat/completions";

    const post = async () => {
      let events: AsyncGenerator<ServerSentEventMessage, void, unknown>;
      let failed = false;

      try {
        const event = await stream(url, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messages[model],
            stream: true,
          }),
        });

        events = event;
      } catch {
        alert(`${model} server not found`);
        failed = true;
      }

      function isValidJSON(str?: string) {
        if (!str)
          return false;

        try {
          JSON.parse(str);
        } catch {
          return false;
        }
        return true;
      }

      if (!failed) {
        for await (const event of events!) {
          if (!isValidJSON(event.data)) {
            console.warn("Invalid JSON format: ", event.data);
            continue;
          }

          if (model == "Llama-2-7B")
            setOutputCode(prev => prev + JSON.parse(event.data!)["choices"][0]["delta"]["content"]);
          else if (model == "Llama-3.1-8B")
            setOutputCode(prev => prev + JSON.parse(event.data!)["choices"][0]["delta"]["content"]);
          else
            alert("Unsupported model");
        }
      } else {
        let last: Array<{ role: string, content: string }>;
        if (model == "Llama-3.1-8B") {
          last = messages["Llama-3.1-8B"];
        } else if (model == "Llama-2-7B") {
          last = messages["Llama-2-7B"];
        } else {
          alert("Unsupport model");
          last = [{ role: "assistant", content: "" }];
        }
          
        setInputCode(last[last.length - 1]["content"]);
      }
      setTransmissionDone(true);
    }

    post();

  }, [loading, setInputCode, messages, setTransmissionDone]);

  useEffect(() => {
    if (!isTransmissionDone)
      return;

    setLoading(false);

    setMessages(prev => {
      if (model == "Llama-3.1-8B") {
        return { "Llama-3.1-8B": [...prev["Llama-3.1-8B"], { role: "assistant", content: outputCode }], "Llama-2-7B": prev["Llama-2-7B"] }
      } else if (model == "Llama-2-7B") {
        return { "Llama-3.1-8B": prev["Llama-3.1-8B"], "Llama-2-7B": [...prev["Llama-2-7B"], { role: "assistant", content: outputCode }] }
      } else {
        alert("Unsupport model");
        return prev;
      }
    });

    if (!inputOnSubmit || !outputCode)
      return;

    setHistory(prev => prev + model + "\n" + inputOnSubmit + "\n" + outputCode + "\n");
  }, [isTransmissionDone, setLoading, outputCode, setMessages, setHistory]);

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Change */}
        <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'Llama-2-7B' ? buttonBg : 'transparent'}
              w="300px"
              h="70px"
              boxShadow={model === 'Llama-2-7B' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('Llama-2-7B')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              Llama-2-7B
            </Flex>
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === "Llama-3.1-8B" ? buttonBg : 'transparent'}
              w="300px"
              h="70px"
              boxShadow={model === "Llama-3.1-8B" ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel("Llama-3.1-8B")}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              Llama-3.1-8B
            </Flex>
          </Flex>

        </Flex>
        {/* Main Box */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
        >
          <Flex w="100%" align={'center'} mb="10px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'transparent'}
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdPerson}
                width="20px"
                height="20px"
                color={brandColor}
              />
            </Flex>
            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex={'2'}
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                {inputOnSubmit}
              </Text>
            </Flex>
          </Flex>
          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              />
            </Flex>
            <MessageBoxChat output={outputCode} />
          </Flex>
        </Flex>
        {/* Chat Input */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            value={inputCode}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleTranslate}
            isLoading={loading ? true : false}
          >
            Submit
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
