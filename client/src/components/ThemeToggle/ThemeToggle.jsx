import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <div className={styles.toggleTrack}>
        <div className={`${styles.toggleThumb} ${theme === 'dark' ? styles.dark : ''}`}>
          {theme === 'light' ? (
            <SunOutlined className={styles.icon} />
          ) : (
            <MoonOutlined className={styles.icon} />
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
