import { VFC, useState, useEffect } from 'react';
import {
  Button,
  Container,
  CssBaseline,
  Grid,
  GridSize,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
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
    outline: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      outline: '1px solid black',
      outlineOffset: -1,
    },
  })
);

class Panel {
  i: number;

  j: number;

  split: number;

  constructor(i: number, j: number, split: number) {
    this.i = i;
    this.j = j;
    this.split = split;
  }

  key(): number {
    return this.i * (this.split + 2) + this.j;
  }
}

const App: VFC = () => {
  const classes = useStyles();
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const [ratio, setRatio] = useState('100%');
  const [split] = useState(4);
  const [panels, setPanels] = useState<Panel[][]>([]);

  useEffect(() => {
    const array = [...Array<Panel[]>(split + 2)].map(() =>
      Array<Panel>(split + 2).fill(new Panel(-1, -1, split))
    );
    for (let i = 0; i < split + 2; i += 1)
      for (let j = 0; j < split + 2; j += 1)
        array[i][j] = new Panel(i, j, split);
    setPanels(array);
  }, [split]);

  const xs = (12 / split) as GridSize;
  const buttonText = imageData ? 'Select another image' : 'Select image';

  const transform = (i: number, j: number) => {
    const x = 0.5 - (j - 0.5) / split;
    const y = 0.5 - (i - 0.5) / split;
    return `scale(${split}) translate(${x * 100}%, ${y * 100}%) `;
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { files } = target;
    const file = files && files.length ? files[0] : null;
    if (!file) return;

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
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Grid container spacing={4}>
        <Grid item container justify="center">
          <Typography component="h1" variant="h5">
            Slide Puzzle Maker
          </Typography>
        </Grid>
        {imageData && (
          <>
            <Grid item container xs={12}>
              {panels.map((row, i) => {
                if (i < 1 || split < i) return null;
                return (
                  <Grid item container direction="row" key={row[0].key()}>
                    {row.map((el, j) => {
                      if (j < 1 || split < j) return null;
                      return (
                        <Grid
                          item
                          container
                          key={el.key()}
                          xs={xs}
                          justify="center"
                        >
                          <div
                            className={classes.imgWrapper}
                            style={{
                              paddingTop: ratio,
                            }}
                          >
                            <img
                              src={imageData}
                              alt="選択画像"
                              className={classes.img}
                              style={{
                                transform: transform(el.i, el.j),
                              }}
                            />
                            <div className={classes.outline} />
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
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
      </Grid>
    </Container>
  );
};

export default App;
