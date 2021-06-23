import { VFC, useState, useEffect } from 'react';
import {
  Button,
  Container,
  createMuiTheme,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Transition } from 'react-transition-group';
import Puzzle from './classes/Puzzle';
import DifficultyDialog from './components/DifficultyDialog';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#00acee',
    },
  },
});

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      userSelect: 'none',
    },
    row: {
      backgroundColor: 'lightgray',
    },
    imgWrapper: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
    },
    img: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    button: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      color: 'transparent',
      cursor: 'pointer',
      padding: 0,
    },
    twitter: {
      color: 'white',
      fontWeight: 700,
      textTransform: 'none',
    },
  })
);

type Trans = {
  i: number;
  j: number;
  di: number;
  dj: number;
};

const App: VFC = () => {
  const classes = useStyles();
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const [ratio, setRatio] = useState('100%');
  const [split, setSplit] = useState(4);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [puzzle, setPuzzle] = useState<Puzzle>(new Puzzle(split, true));
  const [trans, setTrans] = useState<Trans>({ i: -1, j: -1, di: 0, dj: 0 });

  useEffect(() => setPuzzle(new Puzzle(split, true)), [imageData, split]);

  const duration = 100;
  const panelWidth = `${100 / puzzle.split}%`;
  const buttonText = imageData ? '別の画像を選択' : 'パズルにしたい画像を選択';

  const imgTransform = (i: number, j: number) => {
    const x = 0.5 - (j - 0.5) / puzzle.split;
    const y = 0.5 - (i - 0.5) / puzzle.split;
    return `scale(${puzzle.split}) translate(${x * 100}%, ${y * 100}%) `;
  };

  const gridTransition = (state: string) =>
    state === 'entering' ? `all ${duration}ms ease-in-out` : 'none';

  const gridTransform = (state: string) => {
    const enter = state === 'entering' || state === 'entered';
    const x = enter ? trans.dj * 100 : 0;
    const y = enter ? trans.di * 100 : 0;
    return `translate(${x}%, ${y}%)`;
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { files } = target;
    const file = files && files.length ? files[0] : null;
    if (!file) return;

    setImageData(undefined);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      setRatio(`${(img.naturalHeight / img.naturalWidth) * 100}%`);
    };
    img.src = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const { result } = reader;

      setImageData(result as string);
    };
    e.target.value = '';
    setIsDialogOpen(true);
  };

  const onClick = (i: number, j: number) => {
    const [di, dj] = puzzle.getMovingDirection(i, j);
    if (di === 0 && dj === 0) return;
    setTrans({ i, j, di, dj });
  };

  const onEntered = () => {
    const newPuzzle = puzzle.move(trans.i, trans.j, trans.di, trans.dj);
    setPuzzle(newPuzzle);
    setTrans({ i: -1, j: -1, di: 0, dj: 0 });
  };

  const tweet = () => {
    const difficulty = (() => {
      if (split === 3) return 'かんたん';
      if (split === 4) return 'ふつう';
      return 'むずかしい';
    })();
    const text = `スライドパズル(${difficulty})を完成させました！\n\nryochansq.github.io/slide-puzzle/\n\n#なんでもスライドパズル`;
    const encodedText = encodeURIComponent(text);
    const intent = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(intent);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className={classes.container}>
        <CssBaseline />
        <Grid container spacing={4}>
          <Grid item container justify="center">
            <Typography component="h1" variant="h5">
              なんでもスライドパズル
            </Typography>
          </Grid>
          <Grid item container justify="center">
            <Button
              fullWidth={!imageData}
              variant="contained"
              color="primary"
              component="label"
            >
              {buttonText}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={onChangeInput}
              />
            </Button>
          </Grid>
          {imageData && (
            <Grid item container xs={12}>
              {puzzle.panels.map((row, i) => {
                if (i < 1 || puzzle.split < i) return null;
                return (
                  <Grid
                    item
                    container
                    direction="row"
                    key={row[0].key()}
                    className={classes.row}
                  >
                    {row.map((el, j) => {
                      if (j < 1 || puzzle.split < j) return null;
                      return (
                        <Transition
                          key={el.key()}
                          in={trans.i === i && trans.j === j}
                          timeout={duration}
                          onEntered={onEntered}
                        >
                          {(state) => (
                            <Grid
                              item
                              container
                              justify="center"
                              style={{
                                transition: gridTransition(state),
                                transform: gridTransform(state),
                                width: panelWidth,
                              }}
                            >
                              <div
                                className={classes.imgWrapper}
                                style={{
                                  paddingTop: ratio,
                                }}
                              >
                                {(!el.isLowerRight || puzzle.solved()) && (
                                  <>
                                    <img
                                      src={imageData}
                                      alt="選択画像"
                                      className={classes.img}
                                      style={{
                                        transform: imgTransform(el.i, el.j),
                                      }}
                                    />
                                    {!puzzle.solved() && (
                                      <button
                                        type="button"
                                        className={classes.button}
                                        onClick={() => onClick(i, j)}
                                      >
                                        {' '}
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </Grid>
                          )}
                        </Transition>
                      );
                    })}
                  </Grid>
                );
              })}
            </Grid>
          )}
          {puzzle.solved() && (
            <>
              <Grid item container justify="center">
                <Typography component="h1" variant="h5">
                  完成！！
                </Typography>
              </Grid>
              <Grid item container justify="center">
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.twitter}
                  onClick={tweet}
                >
                  Twitterで共有
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
      <DifficultyDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        split={split}
        setSplit={setSplit}
      />
    </ThemeProvider>
  );
};

export default App;
