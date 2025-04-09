import { Box, Text, useColorModeValue, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const MotionBox = motion(Box);

interface ChatMessageProps {
    role: string;
    text: string;
}

const ChatMessage = ({ role, text }: ChatMessageProps) => {
    const isUser = role === 'user';
    const bgColor = useColorModeValue(
        isUser ? 'blue.100' : 'gray.100',
        isUser ? 'blue.700' : 'gray.600'
    );

    const renderers = {
        a: ({ children, ...props }: React.ComponentPropsWithoutRef<'a'>) => (
            <Link {...props} color="teal.500" isExternal>
                {children}
            </Link>
        ),
    };

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            maxW="80%"
            ml={isUser ? 'auto' : '0'}
            mr={isUser ? '0' : 'auto'}
            mb={4}
        >
            <Box
                bg={bgColor}
                p={4}
                borderRadius="lg"
                boxShadow="sm"
            >
                <Text fontSize="md">
                    <ReactMarkdown components={renderers}>{text}</ReactMarkdown>
                </Text>
            </Box>
        </MotionBox>
    );
};

export default ChatMessage;
