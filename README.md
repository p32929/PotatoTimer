# PotatoTimer

A desktop Pomodoro timer that makes you actually take your breaks. Most timers just play a sound when work time is over, and it is easy to click it away and keep going. When PotatoTimer's work time ends, the window goes full screen and stays on top for the whole break, so you step away from the screen.

![PotatoTimer](https://user-images.githubusercontent.com/6418354/93048184-1530fc00-f680-11ea-8094-e74799288ebb.png)

## Features

1. **Forces the break:** when work time ends, the timer fills the screen and stays on top until the break is over.
2. **Set your own lengths:** change the work and break minutes with the plus and minus buttons (25 and 5 by default).
3. **A gentle ding** when it is time for a break, which you can turn off.
4. **Stays out of the way while you work:** minimise it during a session and it hides in the system tray. Click the tray icon to bring it back.

## Download

The Windows installer is on the [releases page](https://github.com/p32929/PotatoTimer/releases/latest). Download the `.exe` installer and run it.

## Run from source

It is an Electron app, so you can also run it on Windows, macOS or Linux from the source:

```bash
git clone https://github.com/p32929/PotatoTimer.git
cd PotatoTimer
npm install
npm start
```

To build an installer for your system, run `npm run dist`.

> This is an older app, built on Electron 9. It is kept as it is and may need small updates to build with today's tools.

## Thanks

Thanks to [mcaubrey](https://github.com/mcaubrey/) for the Pomodoro Clock project this one is based on.

## License

MIT License — Copyright (c) 2018 Fayaz Bin Salam. See [LICENSE](LICENSE) for the full text.

## Contributing

Contributions are very welcome, thank you! Before you start on a pull request, please open an issue and tell me what you would like to add or change. That way we can agree on it first, and your time is not wasted on something that might not fit. Thanks for helping make PotatoTimer better.

## Share

<a href="https://p32929.github.io/share/?repo=PotatoTimer"><picture><source media="(prefers-color-scheme: dark)" srcset="https://p32929.github.io/readme/share-dark.svg"><img src="https://p32929.github.io/readme/share-light.svg" alt="Share this with your friends in just a click" width="420"></picture></a>

## Support

<a href="https://p32929.github.io/support/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://p32929.github.io/readme/support-dark.svg"><img src="https://p32929.github.io/readme/support-light.svg" alt="If you like my works and want to support me, feel free to support" width="420"></picture></a>
