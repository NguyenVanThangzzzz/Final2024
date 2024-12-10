import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './FilterMovie.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function FilterMovie({ onSearch, onFilterGenre, genres }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isGenreLoading, setIsGenreLoading] = useState(false);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsSearchLoading(true);
        
        const timeoutId = setTimeout(() => {
            onSearch(value);
            setIsSearchLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const handleGenreChange = (e) => {
        const value = e.target.value;
        setSelectedGenre(value);
        setIsGenreLoading(true);
        
        const timeoutId = setTimeout(() => {
            onFilterGenre(value);
            setIsGenreLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    return (
        <div className={cx('filter-section')}>
            <div className={cx('search-container')}>
                <input
                    type="text"
                    placeholder="Search movies..."
                    className={cx('search-input')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                {isSearchLoading ? (
                    <div className={cx('loading-spinner')} />
                ) : (
                    <FontAwesomeIcon icon={faSearch} className={cx('search-icon')} />
                )}
            </div>
            <div className={cx('select-container')}>
                <select
                    className={cx('genre-select')}
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    disabled={isGenreLoading}
                >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>
                {isGenreLoading && (
                    <div className={cx('select-loading-spinner')} />
                )}
            </div>
        </div>
    );
}

export default FilterMovie; 