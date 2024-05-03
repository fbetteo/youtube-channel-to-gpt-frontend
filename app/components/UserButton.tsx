import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    IconButton,
} from '@chakra-ui/react';
import { Icon, createIcon } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
const CircleIcon = (props: any) => (
    <Icon viewBox='0 0 200 200' {...props}>
        <path
            fill='currentColor'
            d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
        />
    </Icon>
)


function UserDropdownButton(props: any) {
    const router = useRouter();
    return (
        <Menu>
            {/* Using IconButton for a button with an icon. Replace with Button for text+icon */}
            <MenuButton as={Button} rightIcon={<CircleIcon />} variant="outline" {...props}>
                Options
            </MenuButton>
            <MenuList>
                <MenuItem onClick={() => router.push('/settings')}>Settings</MenuItem>
                <MenuItem onClick={() => router.push('/signout')}>Sign out</MenuItem>
            </MenuList>
        </Menu>
    );
}

export default UserDropdownButton;