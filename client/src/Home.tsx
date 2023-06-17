import { Container } from '@mui/material';
import { Content } from "./Content"

export const Home = () => {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Container>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "74px"
                }}>
                   <Content />
                </div>
            </Container>
        </div>
    );
};